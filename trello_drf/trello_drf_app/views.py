from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Board,BoardList,ListCard,BoardMembers
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response 
from rest_framework.reverse import reverse
from rest_framework import viewsets
from rest_framework.views import APIView
from django.utils import timezone
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsOwnerOrReadOnly, BoardMembersPermission
from django.contrib.auth import authenticate, login, logout
from rest_framework.authtoken.models import Token
from django.template.loader import render_to_string
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from .serializers import BoardSerializer,ListSerializer, CardSerializer,UserSerializer,BoardInviteSerializer, BoardMemberSerializer
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
class BoardViewSet(viewsets.ViewSet):
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticated] 

    def get(self, request):
        """Retrieves all the boards of the user"""
        board = Board.objects.filter(user=request.user)
        serializer = self.serializer_class(board,many=True)          
        return Response(serializer.data)
    
    def post(self, request):
        """Add new board"""
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BoardDetail(viewsets.ViewSet):
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticated, BoardMembersPermission]
    def get_object(self, board_id):
        try:
            return Board.objects.get(id=board_id)
        except Board.DoesNotExist:
            raise Http404

    def get(self, request, **kwargs):        
        board = self.get_object(kwargs.get('board_id'))
        serializer = self.serializer_class(board)        
        return Response(serializer.data)

    def put(self, request, **kwargs):
        """Edit board details"""
        board = self.get_object(kwargs.get('board_id'))
        serializer = self.serializer_class(board, data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

       

    def delete(self, request, **kwargs):
        """Permanently deletes the board"""
        board = self.get_object(kwargs.get('board_id'))
        board.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ListViewSet(viewsets.ViewSet):
    serializer_class = ListSerializer
    permission_classes = [IsAuthenticated, BoardMembersPermission] 

    def get(self, request, **kwargs):
        """Retrieves all the lists of a board instance"""
        board_id = kwargs.get('board_id')
        board = get_object_or_404(Board, id=board_id)
        boardList = BoardList.objects.filter(board=board)
        serializer = self.serializer_class(boardList,many=True)
        
        return Response(serializer.data, status=200)
    
    def post(self, request, **kwargs):   
        """Add new list in a board"""
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListDetail(viewsets.ViewSet):
    serializer_class = ListSerializer
    permission_classes = [IsAuthenticated] 
    
    def get_object(self, list_id):
        try:
            return BoardList.objects.get(id=list_id)
        except Board.DoesNotExist:
            raise Http404

    def get(self, request,**kwargs):
        
        board_list = self.get_object(kwargs.get('list_id'))        
        serializer = self.serializer_class(board_list)
        return Response(serializer.data)

    def put(self, request,**kwargs):
        """Edit list details"""
        board_list = self.get_object(kwargs.get('list_id'))
        serializer = self.serializer_class(board_list, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, **kwargs):
        """Delete list permanently"""
        board_list = self.get_object(kwargs.get('list_id'))
        if request.user.is_authenticated:
            board_list.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_400_BAD_REQUEST)
        
        


class CardViewSet(viewsets.ViewSet):
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated, BoardMembersPermission]  

    def get(self, request, **kwargs):
        """Retrieves all the cards in a list"""
        list_id = kwargs.get('list_id')
        boardList = get_object_or_404(BoardList,id=list_id)
        card = ListCard.objects.filter(board_list=boardList, is_archived=False).order_by('index')
        serializer = self.serializer_class(card,many=True)  
        return Response(serializer.data)

    def archive(self, request, **kwargs):
        """Retrieves all the archived cards"""
        board_id = kwargs.get('board_id')
        card = ListCard.objects.filter(board_list__board=board_id,is_archived=True)
        serializer = self.serializer_class(card,many=True)
    
        return Response(serializer.data)
    
    def post(self, request, **kwargs):
        """Add new card"""
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CardDetail(viewsets.ViewSet):
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self, card_id):
        try:
            return ListCard.objects.get(id=card_id)
        except Board.DoesNotExist:
            raise Http404

    def get(self, request,**kwargs):        
        board_list = self.get_object(kwargs.get('card_id'))
        serializer = self.serializer_class(board_list)
        
        return Response(serializer.data)

    def put(self, request,**kwargs):
        """Edit card details"""
        board_list = self.get_object(kwargs.get('card_id'))
        serializer = self.serializer_class(board_list, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, **kwargs):
        """Delete card"""
        board_list = self.get_object(kwargs.get('card_id'))
        board_list.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def archive(self,request,**kwargs):
        """Archive card"""
        board_list = self.get_object(kwargs.get('card_id'))
        serializer = self.serializer_class(board_list, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def restore(self,request,**kwargs):
        """Restore card"""
        board_list = self.get_object(kwargs.get('card_id'))
        serializer = self.serializer_class(board_list, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



    


"""User manager"""
class UserViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    def login(self,request):
        username = request.data.get("username")
        password = request.data.get("password")
        if username is None or password is None:
            return Response({'error': 'Please provide both username and password'},
                            status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(request,username=username, password=password)
        
        if not user:
            return Response({'error': 'Invalid Credentials'},
                            status=status.HTTP_404_NOT_FOUND)
        token, _ = Token.objects.get_or_create(user=user)
        login(request,user)
        return Response(token.key,status=status.HTTP_200_OK)

    def logout(self,request):
        request.user.auth_token.delete()
        logout(request)
        return Response(status=status.HTTP_200_OK)
    
    def create(self,request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
"""Retrieves all the members of a board"""
class Members(viewsets.ViewSet):
    serializer_class = BoardMemberSerializer

    def get(self, request, **kwargs):
        board_id = kwargs.get('board_id')
        board = get_object_or_404(Board,id=board_id)
        board_members = BoardMembers.objects.filter(board=board)        
        serializer = self.serializer_class(board_members, many=True)
        return Response(serializer.data , status=200)

"""Invitation email using smtp"""
class InviteMember(viewsets.ViewSet):
    serializer_class = BoardInviteSerializer
    def invite_member(self,request,**kwargs):

        serializer = self.serializer_class(data=request.data)
        board = get_object_or_404(Board,id=kwargs.get("board_id"))
        user = request.user        
        
        if (serializer.is_valid()):
            serializer = serializer.save()
            subject = 'ANGULAR IS... OKEH KEEYOH'
            message = ' '
            email_from = settings.EMAIL_HOST_USER
            recipient_list = [serializer.email,]
            html_message = render_to_string(
                'trello/email_template.html',
                {                
                'board':board,
                'user': user.get_username(),
                'uuid':serializer.uuid,
                'scheme': request.scheme,
                'domain': request.META['HTTP_HOST'],
                'path': request.path
                }
            )
            #task = invite_member.delay(subject, message, email_from, recipient_list, html_message)            
            send_mail( subject, message, email_from, recipient_list, html_message=html_message)
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def create_member(self,request,**kwargs):
        
        serializer = BoardMemberSerializer(data=request.data)
        if (serializer.is_valid()):
            serializer.save(member=request.user)
            return Response (serializer.data, status=status.HTTP_201_CREATED)
        


@api_view(['GET'])
def api_root(request):
    return Response({    
        'boards': reverse('board-list', request=request ),
        'lists': reverse('list-list', request=request),
        'cards': reverse('card-list', request=request),
    })