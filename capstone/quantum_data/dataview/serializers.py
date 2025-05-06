from rest_framework import serializers
from .models import efp

class EfpSerializer(serializers.ModelSerializer):
    class Meta:
        model = efp
        fields = '__all__'
