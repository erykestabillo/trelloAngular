from django.contrib import admin
from .models import Board,BoardList,BoardInvite,BoardMembers,ListCard, BoardMembers
from django.contrib.auth.models import Group
from django.contrib.auth.models import User

# Register your models here.
admin.site.register(Board)
admin.site.register(BoardList)
admin.site.register(BoardInvite)
admin.site.register(BoardMembers)
admin.site.register(ListCard)




