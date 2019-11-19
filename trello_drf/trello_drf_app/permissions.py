from rest_framework import permissions
from .models import BoardMembers
from django.http import Http404

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user


class BoardMembersPermission(permissions.BasePermission):    
    def has_permission(self, request, view):
        member = BoardMembers.objects.filter(board_id=view.kwargs.get('board_id'),member_id=request.user)
        if member.exists():
            return True
        raise Http404('You do not have permission.')
        
