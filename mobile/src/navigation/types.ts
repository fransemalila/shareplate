import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  CreateListing: undefined;
  Orders: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  ListingDetails: { id: string };
  SellerProfile: { id: string };
};

export type OrdersStackParamList = {
  OrdersList: undefined;
  OrderDetails: { id: string };
  Review: { orderId: string; listingId: string };
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  EditProfile: undefined;
  Settings: undefined;
  MyListings: undefined;
  Addresses: undefined;
  PaymentMethods: undefined;
};

export type NavigationProps<T extends keyof RootStackParamList> = {
  navigation: NativeStackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
}; 