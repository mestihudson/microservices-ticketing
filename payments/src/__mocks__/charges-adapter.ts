export const chargesAdapter = {
  create: jest.fn().mockImplementation(() => {
    return Promise.resolve({ stripeId: "stripe-id" });
  }),
};
