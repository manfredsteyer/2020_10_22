import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';


export interface State {

}

export const reducers: ActionReducerMap<State> = {
  // currUser: authReducer
  // flightBooking: flightBookingReducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
