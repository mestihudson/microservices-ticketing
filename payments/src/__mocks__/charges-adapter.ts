export const chargesAdapter = {
  create: jest.fn().mockImplementation((price: number, token: string) => {
    return Promise.resolve();
  }),
};
