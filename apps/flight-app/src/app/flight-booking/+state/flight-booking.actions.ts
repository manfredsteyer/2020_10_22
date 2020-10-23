import { Flight } from '@flight-workspace/flight-lib';
import { createAction, props } from '@ngrx/store';

export const flightsLoaded = createAction(
  '[FlightBooking] flightsLoaded',            // Events
  props<{flights: Flight[]}>()
);

export const updateFlight = createAction(
  '[FlightBooking] updateFlight',             // Command
  props<{flight: Flight}>()
);



