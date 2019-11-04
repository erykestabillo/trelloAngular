from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from trello_drf_app import views
from rest_framework.authtoken import views as view
from .views import BoardViewSet,BoardDetail,ListViewSet,ListDetail,CardViewSet,CardDetail,UserViewSet,InviteMember

urlpatterns = [
    path('boards/', BoardViewSet.as_view({'get': 'get','post':'post'}),name="board-list"),
    path('board/<int:board_id>/', BoardDetail.as_view({'get':'get','put':'put','delete':'delete'}),name="board-detail"),
    path('board/<int:board_id>/list/', ListViewSet.as_view({'get': 'get','post':'post'}),name="list-list"),
    path('<int:board_id>/<int:list_id>/', ListDetail.as_view({'get':'get','put':'put','delete':'delete'}),name="list-detail"),
    path('board/<int:list_id>/card/', CardViewSet.as_view({'get': 'get','post':'post'}),name="card-list"),
    path('<int:board_id>/<int:list_id>/<int:card_id>/', CardDetail.as_view({'get':'get','put':'put','delete':'delete'}),name="list-detail"),
    path('login/',UserViewSet.as_view({'post':'login'}),name="login"),
    path('register/',UserViewSet.as_view({'post':'create'}),name="register"),
    path('board/<int:board_id>/invite/', InviteMember.as_view({'post':'invite_member'}), name="inviteMember"),
    path('board/<int:board_id>/accept/', InviteMember.as_view({'post':'create_member'}), name="createMember"),
    path('', views.api_root),

]
