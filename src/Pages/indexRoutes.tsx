import React from 'react';
import { Route, Routes } from 'react-router-dom';

import MainPage from './index';
import CabinetPage from './cabinet';
import AuthPage from './auth';
import RegPage from './register';
import ProfilePage from './profile';
import RatingPage from './rating';
import ListOfUsersPage from './listOfUsers';
import CheckUserInfoPage from './checkUserInfo';
import EditUserPage from './editUserPage';
import ShopPage from './shopPage';
import MyShopLogsPage from './myShopLogsPage';
import EditShopItemPage from './editShopItemPage';
import ShopItemStatPage from './shopItemStatPage';
import ShopItemsListPage from './shopItemsList';
import AddShopItemPage from './addShopItemPage';
import AddPrvtShopItemPage from './addPrvtShopItemPage';
import ListOfAllInitiativesPage from './listOfAllInitiatives';
import ListInitiativesResultsPage from './listInitiativesResults';
import InitiativeStatPage from './initiativeStat';
import EditInitiativePage from './editInitiative';
import CheckInitiativePage from './checkInitiative';
import AddPrivateInitiativePage from './addPrivateInitiative';
import AddPublicInitiativePage from './addPublicInitiative';
import VerifMail from './verifMail';
import BigInitiativesStatistics from './statistic/bigInitiativesStatistics';

export default function IndexRoutes() {
  return (
    <Routes>
      <Route path='/' element={<MainPage />} />
      <Route path='/auth' element={<AuthPage />} />
      <Route path='/register' element={<RegPage />} />
      <Route path='/cab' element={<CabinetPage />} />
      <Route path='/profile' element={<ProfilePage />} />
      <Route path='/rating' element={<RatingPage />} />
      <Route path='/users' element={<ListOfUsersPage />} />
      <Route path='/users/check/:user_id' element={<CheckUserInfoPage />} />
      <Route path='/users/edit/:user_id' element={<EditUserPage />} />
      <Route path='/shop' element={<ShopPage />} />
      <Route path='/shop/story' element={<MyShopLogsPage />} />
      <Route path='/shop/edit/:item_id' element={<EditShopItemPage />} />
      <Route path='/shop/stat/:item_id' element={<ShopItemStatPage />} />
      <Route path='/shop/edit' element={<ShopItemsListPage />} />
      <Route path='/shop/add/public' element={<AddShopItemPage />} />
      <Route path='/shop/add/prvt' element={<AddPrvtShopItemPage />} />
      <Route path='/initiatives/edit' element={<ListOfAllInitiativesPage />} />
      <Route path='/initiatives/results' element={<ListInitiativesResultsPage />} />
      <Route path='/initiatives/stat/:initiative_id' element={<InitiativeStatPage />} />
      <Route path='/initiatives/edit/:initiative_id' element={<EditInitiativePage />} />
      <Route path='/initiatives/check/:initiative_id' element={<CheckInitiativePage />} />
      <Route path='/addPrivateInitiative' element={<AddPrivateInitiativePage />} />
      <Route path='/addPublicInitiative' element={<AddPublicInitiativePage />} />
      <Route path='/mail/verif/:id/:code' element={<VerifMail />} />
      <Route path='/statistic/big-initiatives-statistics' element={<BigInitiativesStatistics />} />
    </Routes>
  );
}
