from rest_framework import serializers
from .models import efp, workshop

class EfpSerializer(serializers.ModelSerializer):
    class Meta:
        model = efp
        fields = '__all__'



class WorkshopSerializer(serializers.ModelSerializer):
    class Meta:
        model = workshop
        fields = '__all__'
