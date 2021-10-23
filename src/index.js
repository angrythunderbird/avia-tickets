import './index.scss';
import './js/libs/index.js';
import locations from './js/store/locations.js';
import formUI from './js/views/form.js';
import currencyUI from './js/views/currency.js';
import ticketsUI from './js/views/tickets.js';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  const { form } = formUI;

  // Events
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    onFormSubmit();
  });

  console.log(currencyUI.currencySymbol);

  // Handlers
  async function initApp() {
    await locations.init();
    formUI.setAutocompleteData(locations.shortCitiesList);
  }

  async function onFormSubmit() {
    // Acc inputs data
    const origin = locations.getCityCodeByKey(formUI.originValue);
    const destination = locations.getCityCodeByKey(formUI.destinationValue);
    const depart_date = formUI.departDateValue;
    const return_date = formUI.returnDateValue;
    const currency = currencyUI.currencyValue;

    // CODE, CODE, 2019-09, 2019-10
    await locations.fetchTickets({
      origin,
      destination,
      depart_date,
      return_date,
      currency,
    });
    console.log(locations.lastSearch);
    ticketsUI.renderTickets(locations.lastSearch);
  }
});
