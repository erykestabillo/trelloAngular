from django.db import models
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from uuid import uuid4
from django.contrib.auth.models import User
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created


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
    board_list = models.ForeignKey(BoardList, on_delete=models.CASCADE)
    is_archived = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    index = models.FloatField(default=0.0)
    
    def __str__(self):
        return self.title


class BoardInvite(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    email = models.EmailField(max_length=255)



class BoardMembers(models.Model):
    member = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    
    def __str__(self):
        return str(self.member)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

@receiver(post_save, sender=Board)
def create_member(sender, instance, created, **kwargs):
    if created:
        BoardMembers.objects.create(board=instance, member=instance.user)

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    :param sender: View Class that sent the signal
    :param instance: View Instance that sent the signal
    :param reset_password_token: Token Model Object
    :param args:
    :param kwargs:
    :return:
    """
    # send an e-mail to the user
    context = {
        'current_user': reset_password_token.user,
        'username': reset_password_token.user.username,
        'email': reset_password_token.user.email,
        'reset_password_url': "{}?token={}".format(reverse('password_reset:reset-password-request'), reset_password_token.key)
    }

    # render email text
    email_html_message = render_to_string('email/user_reset_password.html', context)
    email_plaintext_message = render_to_string('email/user_reset_password.txt', context)

    msg = EmailMultiAlternatives(
        # title:
        "Password Reset for {title}".format(title="Some website title"),
        # message:
        email_plaintext_message,
        # from:
        settings.EMAIL_HOST_USER,
        # to:
        [reset_password_token.user.email]
    )
    msg.attach_alternative(email_html_message, "text/html")
    msg.send()