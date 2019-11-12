from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Board,BoardList,ListCard,BoardMembers
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response 
from rest_framework.reverse import reverse
from .permissions import IsOwnerOrReadOnly
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.template.loader import render_to_string
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from .serializers import BoardSerializer,ListSerializer, CardSerializer,UserSerializer,BoardInviteSerializer


# Create your views here.
class BoardViewSet(viewsets.ViewSet):
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticated] 

    def get(self, request):
        board = Board.objects.all()
        serializer = self.serializer_class(board,many=True)          
        return Response(serializer.data)
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BoardDetail(viewsets.ViewSet):
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self, board_id):
        try:
            return Board.objects.get(id=board_id)
        except Board.DoesNotExist:
            raise Http404

    def get(self, request, board_id):
        board = self.get_object(board_id)
        serializer = self.serializer_class(board)        
        return Response(serializer.data)

    def put(self, request, board_id):
        board = self.get_object(board_id)
        serializer = self.serializer_class(board, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, board_id):
        board = self.get_object(board_id)
        board.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ListViewSet(viewsets.ViewSet):
    serializer_class = ListSerializer
    permission_classes = [IsAuthenticated] 

    def get(self, request, **kwargs):
        board_id = kwargs.get('board_id')
        board = get_object_or_404(Board, id=board_id)
        boardList = BoardList.objects.filter(board=board)
        serializer = self.serializer_class(boardList,many=True)
        
        return Response(serializer.data, status=200)
    
    def post(self, request, **kwargs):        
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
        board_list = self.get_object(kwargs.get('list_id'))
        serializer = self.serializer_class(board_list, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, **kwargs):
        board_list = self.get_object(kwargs.get('list_id'))
        if request.user.is_authenticated:
            board_list.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_400_BAD_REQUEST)
        
        


class CardViewSet(viewsets.ViewSet):
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]  

    def get(self, request, **kwargs):
        list_id = kwargs.get('list_id')
        boardList = get_object_or_404(BoardList,id=list_id)
        card = ListCard.objects.filter(board_list=boardList)
        serializer = self.serializer_class(card,many=True)  
        return Response(serializer.data)
    
    def post(self, request, **kwargs):
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
        board_list = self.get_object(kwargs.get('card_id'))
        serializer = self.serializer_class(board_list, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, **kwargs):
        board_list = self.get_object(kwargs.get('card_id'))
        board_list.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    



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
        return Response(token.key,status=status.HTTP_200_OK)
    
    def create(self,request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        


class InviteMember(viewsets.ViewSet):
    serializer_class = BoardInviteSerializer
    def invite_member(self,request,**kwargs):
        serializer = self.serializer_class(data=request.data)
        board = get_object_or_404(Board,id=kwargs.get("board_id"))
        user = request.user        
        if (serializer.is_valid()):            
            serializer = serializer.save()
            subject = 'CELERY IS LIT AF'
            message = ' '
            email_from = settings.EMAIL_HOST_USER
            recipient_list = [serializer.email,]
            html_message = render_to_string(
                'trello/email_template.html',
                {                
                'board':board,
                'user': user.get_username(),
                'uuid':serializer.uuid,
                'domain': request.META['HTTP_HOST'],
                }
            )
            #task = invite_member.delay(subject, message, email_from, recipient_list, html_message)            
            send_mail( subject, message, email_from, recipient_list, html_message=html_message)
            return Response(serializer, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def create_member(self,request,**kwargs):
        board = get_object_or_404(Board,id=kwargs.get("board_id"))
        board_member, created = BoardMembers.objects.get_or_create(member=request.user,board=board)
        if (created):
            board_member.save()
            return Response(board_member, status=status.HTTP_201_CREATED)      
        else:
            return Response(board_member, status=status.HTTP_400_BAD_REQUEST)
            
            


@api_view(['GET'])
def api_root(request):
    return Response({    
        'boards': reverse('board-list', request=request ),
        'lists': reverse('list-list', request=request),
        'cards': reverse('card-list', request=request),
    })