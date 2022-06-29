import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { toast } from 'react-toastify';
import {
  setOffers,
  setOffer,
  setLoading as setOffersIsLoading,
} from './offers-data/offers-data';
import {
  setActiveOffer,
  setLoading as setOfferIsLoading,
} from './offer-data/offer-data';
import {
  setPremiumOffers,
  setLoading as setPremiumOffersIsLoading,
} from './premium-data/premium-data';
import {
  setReviews,
  setLoading as setReviewsIsLoading,
} from './reviews-data/reviews-data';
import {
  setFavoriteOffers,
  setLoading as setFavoriteOffersIsLoading,
} from './favorite-data/favorite-data';
import { setUser, setAuthorizationStatus } from './user-data/user-data';
import { AppDispatch, State } from '../types/state';
import { Offer } from '../types/offer';
import { NewReview } from '../types/new-review';
import { AuthData } from '../types/auth-data';
import { APIRoute, AuthorizationStatus, HTTP_CODE, NameSpace } from '../const';
import { saveToken, dropToken } from '../services/token';
import { NewOffer } from '../types/new-offer';
import { NewUser } from '../types/new-user';
import { adaptCommentsToClient, adaptOffersToClient, adaptOfferToClient, adaptUserToClient } from '../utils/adapters/adaptersToClient';
import CreatedUserDto from '../dto/created-user.dto';
import { adaptAvatarToServer, adaptCommentToServer, adaptOfferToServer, adaptSignupToServer } from '../utils/adapters/adaptersToServer';
import LoggedUserDto from '../dto/logged-user.dto';
import OfferDto from '../dto/offer.dto';
import CommentDto from '../dto/comment.dto';
import CreateCommentDto from '../dto/create-comment.dto';

type AsyncThunkConfig = {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
};

export const fetchOffers = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.Offers}/fetchOffers`,
  async (_arg, { dispatch, extra: api }) => {
    dispatch(setOffersIsLoading(true));
    try {
      const { data } = await api.get<OfferDto[]>(APIRoute.Offers);
      dispatch(setOffers(adaptOffersToClient(data)));
    } catch {
      toast.error('Can\'t fetch offers');
    } finally {
      dispatch(setOffersIsLoading(false));
    }
  }
);

export const fetchOffer = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Offer}/fetchOffer`,
  async (id, { dispatch, extra: api }) => {
    dispatch(setOfferIsLoading(true));
    try {
      const { data } = await api.get<OfferDto>(`${APIRoute.Offers}/${id}`);
      dispatch(setActiveOffer(adaptOfferToClient(data)));
    } catch {
      dispatch(setActiveOffer(null));
      toast.error('Can\'t fetch offer');
    } finally {
      dispatch(setOfferIsLoading(false));
    }
  }
);

export const editOffer = createAsyncThunk<void, Offer, AsyncThunkConfig>(
  `${NameSpace.Offer}/editOffer`,
  async (offerData, { dispatch, extra: api }) => {
    try {
      const { data } = await api.put<Offer>(
        `${APIRoute.Offers}/${offerData.id}`,
        offerData
      );
      dispatch(setActiveOffer(data));
    } catch {
      throw new Error('Can\'t edit offer');
    }
  }
);

export const addOffer = createAsyncThunk<void, NewOffer, AsyncThunkConfig>(
  `${NameSpace.Offer}/addOffer`,
  async (offerData, { dispatch, extra: api }) => {
    try {
      const { data } = await api.post<OfferDto>(
        `${APIRoute.Offers}`,
        adaptOfferToServer(offerData)
      );
      dispatch(setActiveOffer(adaptOfferToClient(data)));
    } catch {
      throw new Error('Can\'t add offer');
    }
  }
);

export const deleteOffer = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Offer}/deleteOffer`,
  async (id, { dispatch, extra: api }) => {
    try {
      await api.delete(`${APIRoute.Offers}/${id}`);
      dispatch(setActiveOffer(null));
    } catch {
      throw new Error('Can\'t delete offer');
    }
  }
);


export const fetchPremiumOffers = createAsyncThunk<
  void,
  string,
  AsyncThunkConfig
>(
  `${NameSpace.Premium}/fetchPremiumOffers`,
  async (id, { dispatch, extra: api }) => {
    dispatch(setPremiumOffersIsLoading(true));
    try {
      const { data } = await api.get<OfferDto[]>(
        `${APIRoute.Offers}/${APIRoute.Premium}`
      );
      dispatch(setPremiumOffers(adaptOffersToClient(data)));
    } catch {
      toast.error('Can\'t fetch premium offers');
    } finally {
      dispatch(setPremiumOffersIsLoading(false));
    }
  }
);

export const fetchReviews = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Reviews}/fetchReviews`,
  async (id, { dispatch, extra: api }) => {
    dispatch(setReviewsIsLoading(true));
    try {
      const { data } = await api.get<CommentDto[]>(`${APIRoute.Offers}/${id}${APIRoute.Comments}`);
      dispatch(setReviews(adaptCommentsToClient(data)));
    } catch {
      toast.error('Can\'t fetch reviews');
    } finally {
      dispatch(setReviewsIsLoading(false));
    }
  }
);

export const postReview = createAsyncThunk<void, { id: string; review: NewReview },AsyncThunkConfig> (
  `${NameSpace.Reviews}/postReview`,
  async ({ id, review }, { dispatch, extra: api }) => {
    try {
      await api.post<CreateCommentDto>(`${APIRoute.Comments}/${id}`, adaptCommentToServer(review));
      await dispatch(fetchReviews(id));
    } catch {
      toast.error('Can\'t post review');
    }
  }
);

export const checkAuth = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.User}/login`,
  async (_arg, { dispatch, extra: api }) => {
    try {
      const { data } = await api.get(`${APIRoute.Users}${APIRoute.Login}`);
      dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
      dispatch(setUser(adaptUserToClient(data)));
    } catch {
      dropToken();
      dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
      dispatch(setUser(null));
    }
  }
);

export const login = createAsyncThunk<void, AuthData, AsyncThunkConfig>(
  `${NameSpace.User}/login`,
  async (authData, { dispatch, extra: api }) => {
    try {
      const {data} = await api.post<LoggedUserDto>(`${APIRoute.Users}${APIRoute.Login}`, authData);
      const {token} = data;
      saveToken(token);
      dispatch(checkAuth());
      dispatch(setUser(adaptUserToClient(data)));
    } catch {
      toast.error('Can\'t login');
    }
  }
);

export const logout = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.User}/logout`,
  async (_arg, { dispatch, extra: api }) => {
    try {
      await api.delete(`${APIRoute.Users}${APIRoute.Logout}`);
      dropToken();
      dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
      dispatch(setUser(null));
    } catch {
      toast.error('Can\'t logout');
    }
  }
);

export const fetchFavoriteOffers = createAsyncThunk<
  void,
  undefined,
  AsyncThunkConfig
>(
  `${NameSpace.Favorite}/fetchFavoriteFilms`,
  async (_arg, { dispatch, extra: api }) => {
    dispatch(setFavoriteOffersIsLoading(true));
    try {
      const { data } = await api.get<Offer[]>(`${APIRoute.Favorite}`);
      dispatch(setFavoriteOffers(data));
    } catch {
      toast.error('Can\'t fetch favorite films');
    } finally {
      dispatch(setFavoriteOffersIsLoading(false));
    }
  }
);

export const setFavorite = createAsyncThunk<
  void,
  { id: string; status: number },
  AsyncThunkConfig
>(
  `${NameSpace.Favorite}/setFavorite`,
  async ({ id, status }, { dispatch, extra: api }) => {
    try {
      const { data } = await api.post<Offer>(
        `${APIRoute.Favorite}/${id}/${status}`
      );
      dispatch(setOffer(data));
      dispatch(fetchFavoriteOffers());
    } catch {
      toast.error('Can\'t add to or remove from MyList');
    }
  }
);

export const registerUser = createAsyncThunk<void, NewUser, AsyncThunkConfig>(
  `${NameSpace.User}/register`,
  async (userData, { extra: api }) => {
    const { avatar } = userData;
    delete userData.avatar;

    try {
      const postData = await api.post<CreatedUserDto>(`${APIRoute.Users}${APIRoute.Register}`, adaptSignupToServer(userData));
      const {data} = postData;
      if (postData.status === HTTP_CODE.CREATED && avatar) {
        await api.post(`${APIRoute.Users}/${data.id}${APIRoute.SetAvatar}`, adaptAvatarToServer(avatar), {
          headers: {'Content-Type': 'multipart/form-data'},
        });
      }
    } catch {
      throw new Error('Can\'t sign up');
    }
  }
);
