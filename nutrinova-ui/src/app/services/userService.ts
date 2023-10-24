import axios from 'axios';

export interface Customer{
    id: string;
    firstName: string;
}


const userService = {
  async userExists(id: string): Promise<boolean> {
    try {
      const response = await axios.get(`https://localhost:3000be/customer?id=${id}`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },

  async createUser(user: Customer): Promise<boolean> {
    try {
      const response = await axios.post(`be/customer/create`, user, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.status === 201; // Assuming a successful creation returns HTTP status 201
    } catch (error) {
      return false;
    }
  },
};


export default userService;