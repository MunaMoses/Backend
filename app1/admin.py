# core/admin.py

from django.contrib import admin
from .models import *

admin.site.register(Profile)
admin.site.register(Product)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Review)