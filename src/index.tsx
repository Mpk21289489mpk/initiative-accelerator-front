import React from 'react';
import { createRoot } from 'react-dom/client';
import './normalize.css';
import './index.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import MainPage from './Pages/index';
import CabinetPage from './Pages/cabinet';
import { GlobalUserStateContextProvider } from './Modules/User/User';
import AddPrivateInitiativePage from './Pages/addPrivateInitiative';
import Header from './Modules/header';
import Footer from './Modules/footer';
import RatingPage from './Pages/rating';
import AuthPage from './Pages/auth';
import RegPage from './Pages/register';
import ListInitiativesResultsPage from './Pages/listInitiativesResults';
import CheckInitiativePage from './Pages/checkInitiative';
import AddPublicInitiativePage from './Pages/addPublicInitiative';
import AddShopItemPage from './Pages/addShopItemPage';
import ShopPage from './Pages/shopPage';
import MyShopLogsPage from './Pages/myShopLogsPage';
import EditInitiativePage from './Pages/editInitiative';
import ListOfAllInitiativesPage from './Pages/listOfAllInitiatives';
import ShopItemsListPage from './Pages/shopItemsList';
import EditShopItemPage from './Pages/editShopItemPage';
import ProfilePage from './Pages/profile';
import ListOfUsersPage from './Pages/listOfUsers';
import EditUserPage from './Pages/editUserPage';
import InitiativeStatPage from './Pages/initiativeStat';
import CheckUserInfoPage from './Pages/checkUserInfo';
import ShopItemStatPage from './Pages/shopItemStatPage';
// globalAny не нужен: Яндекс Метрика подключается только в public/index.html
import SiteClosed from './Modules/SiteClosed';
import VerifMail from './Pages/verifMail';
import AddPrvtShopItemPage from './Pages/addPrvtShopItemPage';
import BigInitiativesStatistics from './Pages/statistic/bigInitiativesStatistics';

function Index() {
  // SiteClosed временно убран, чтобы исключить блокировку рендера.
  // Если приложение заработает — будем возвращать и чинить логику внутри него.
  return (
    <BrowserRouter>
      <GlobalUserStateContextProvider>
        <Header />
        <div className='container'>
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

            // Путь без .csv, чтобы Vercel не пытался отдать статический файл
            <Route path='/statistic/big-initiatives-statistics' element={<BigInitiativesStatistics />} />
          </Routes>
        </div>
        <Footer />
      </GlobalUserStateContextProvider>
    </BrowserRouter>
  );
}

const rootElement = createRoot(document.getElementById('root')!);
rootElement.render(<Index />);
