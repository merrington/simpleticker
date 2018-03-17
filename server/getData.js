class Ws {
  constructor(wsAuth) {
    this.wsAuth = wsAuth;
  }

  async getClients() {
    return (await this.wsAuth.get('/users')).results;
  };

  async getAccounts(client = undefined) {
    return (await this.wsAuth.get('/accounts')).results;
  };

  async getDailyValues(account, start_date, end_date) {
    return (await this.wsAuth.get(`/daily_values?account_id=${account.id}&summary_date_start=${start_date}&summary_date_end=${end_date}`)).results;
  };

  async getPositions(account, date) {
    return (await this.wsAuth.get(`/positions?account_id=${account.id}&date=${date}`)).results;
  }
}

export default Ws;
