from django.db import models
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from uuid import uuid4

# Create your models here.
class Board(models.Model):
    title = models.CharField(max_length=50)
    date_created = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    is_archived = models.BooleanField(default=False)
    
    def publish(self):
        self.date_created = timezone.now()
        self.save()

    def __str__(self):
        return self.title

class BoardList(models.Model):
    title = models.CharField(max_length=50)
    date_created = models.DateTimeField(default=timezone.now)
    board = models.ForeignKey(Board, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class ListCard(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField(max_length=200, null=True)
    date_created = models.DateTimeField(default=timezone.now)
    board_list = models.ForeignKey(BoardList, on_delete=models.CASCADE, null=True)
    is_archived = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title


class BoardInvite(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    board = models.ForeignKey(Board, on_delete=models.CASCADE, null=True)
    email = models.EmailField(max_length=255,unique=True)



class BoardMembers(models.Model):
    member = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    board = models.ForeignKey(Board, on_delete=models.CASCADE, null=True)
    
    def __str__(self):
        return str(self.member)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
        