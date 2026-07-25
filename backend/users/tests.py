from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class UsersModelTests(TestCase):
    def setUp(self):
        self.customer = User.objects.create_user(
            username="testcustomer",
            email="customer@example.com",
            password="securepassword123",
            role="CUSTOMER",
            wallet_balance=500.00
        )

    def test_user_creation_and_role(self):
        self.assertEqual(self.customer.username, "testcustomer")
        self.assertEqual(self.customer.role, "CUSTOMER")
        self.assertEqual(float(self.customer.wallet_balance), 500.00)
