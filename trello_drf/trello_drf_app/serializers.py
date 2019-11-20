from rest_framework import serializers
from .models import Board,BoardList,ListCard,BoardInvite, BoardMembers
from django.contrib.auth.models import User
from rest_framework.fields import CurrentUserDefault


class BoardSerializer(serializers.ModelSerializer):    
    user = serializers.CharField(read_only=True,source='user.username')    
    class Meta:
        model = Board
        fields = ('id',
                'title',
                'date_created',
                'user')


class ListSerializer(serializers.ModelSerializer):    
    
    class Meta:
        model = BoardList
        fields = ('id',
                  'title',
                  'board',
                  'date_created')


class CardSerializer(serializers.ModelSerializer):    
    
    class Meta:
        model = ListCard
        fields = ("__all__")




class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'email', )

    def create(self, validated_data):
        user = User.objects.create_user(
            email = validated_data['email'],
            username = validated_data['username'],
            password = validated_data['password'],
        )
        return user


class BoardInviteSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardInvite
        fields = ['email','board']

class BoardMemberSerializer(serializers.ModelSerializer):
    member = serializers.ReadOnlyField(source='member.username')
    
    class Meta:
        model = BoardMembers
        fields = ("__all__")

    def create(self, validated_data):
        import pdb; pdb.set_trace()
        board_member, created = BoardMembers.objects.get_or_create(**validated_data)
        return board_member
