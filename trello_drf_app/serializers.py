from rest_framework import serializers
from .models import Board,BoardList,ListCard,BoardInvite
from django.contrib.auth.models import User

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
        fields = ("__all__")


class CardSerializer(serializers.ModelSerializer):    
    
    class Meta:
        model = ListCard
        fields = ('id',
                'title',
                'description',
                'date_created',)


# class UserSerializer(serializers.ModelSerializer):
#     boards = serializers.PrimaryKeyRelatedField(many=True, queryset=Board.objects.all())
#     class Meta:
#         model = User
#         fields = ('id', 'username','boards')



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