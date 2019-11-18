from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from trello_drf_app import views
from rest_framework.authtoken import views as view
from .views import BoardViewSet,BoardDetail,ListViewSet,ListDetail,CardViewSet,CardDetail,UserViewSet,InviteMember,Members

urlpatterns = [
    path('boards/', BoardViewSet.as_view({'get': 'get','post':'post'}),name="board-list"),
    path('board/<int:board_id>/', BoardDetail.as_view({'get':'get','put':'put','delete':'delete'}),name="board-detail"),
    path('board/<int:board_id>/list/', ListViewSet.as_view({'get': 'get','post':'post'}),name="list-list"),
    path('board/list/<int:list_id>/edit/', ListDetail.as_view({'get':'get','put':'put'}),name="list-detail"),
    path('board/list/delete/<int:list_id>/', ListDetail.as_view({'delete':'delete'}),name="list-delete"),
    path('board/<int:list_id>/card/', CardViewSet.as_view({'get': 'get','post':'post'}),name="card-list"),
    path('<int:board_id>/list/card/archives/', CardViewSet.as_view({'get': 'archive'}),name="card-archive"),
    path('board/<int:list_id>/<int:card_id>/index/', CardDetail.as_view({'put':'put'}),name="card-index"),
    path('board/<int:list_id>/<int:card_id>/', CardDetail.as_view({'get':'get','put':'put','delete':'delete'}),name="card-detail"),
    path('board/list/<int:card_id>/delete/', CardDetail.as_view({'delete':'delete'}),name="card-delete"),
    path('board/list/<int:card_id>/archive/', CardDetail.as_view({'put':'archive'}),name="card-delete"),
    path('board/list/<int:card_id>/archive/restore/', CardDetail.as_view({'put':'restore'}),name="card-restore"),
    path('logout/',UserViewSet.as_view({'get':'logout'}),name="login"),
    path('login/',UserViewSet.as_view({'post':'login'}),name="login"),
    path('register/',UserViewSet.as_view({'post':'create'}),name="register"),
    path('board/<int:board_id>/invite/', InviteMember.as_view({'post':'invite_member'}), name="inviteMember"),
    path('board/<int:board_id>/accept/', InviteMember.as_view({'post':'create_member'}), name="createMember"),
    path('board/<int:board_id>/members/', Members.as_view({'get':'get'}), name="createMember"),
    path('', views.api_root),

]
