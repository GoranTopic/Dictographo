from rest_framework import permissions


class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj=None):
        # Read-only permissions are allowed for any request
        # beacuse if the request method is GET OPTIONS and HEAD then 
        # permissions are granted safely
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to the author of a post
        # if it is not in  the SAFE_METHODS the is must be for post of update 
        # and thus it is only granted if the object author is the reques user
        if obj is None:
            return False
        elif hasattr(obj, 'author'):
            return obj.author == request.user
        elif hasattr(obj, 'username'):
            return obj.username == request.user
        else:
            return False


