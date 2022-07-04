describe("Log In", () => {
  const user = cy;

  it("should see login page", () => {
    user.visit("/")
      .title()
      .should("eq", "Login | Nuber Eats");
  });  

  it("can see email & password validation errors", () => {
    user.visit("/")
    user.findByPlaceholderText(/email/i).type('bad@email');
    user.findByRole('alert').should("have.text", "Please enter a valid email");
    user.findByPlaceholderText(/email/i).clear();
    user.findByRole('alert').should("have.text", "Email is required");
    user.findByPlaceholderText(/email/i).type("testDev@gmail.com");
    user.findByPlaceholderText(/password/i).type("test").clear();
    user.findByRole('alert').should("have.text", "Password is required");
  });

  it("can fill out the form log in", () => {
    user.visit("/");
    user.findByPlaceholderText(/email/i).type('tester@gmail.com');
    user.findByPlaceholderText(/password/i).type('0000')
    user.findByRole("button").should('not.have.class', 'pointer-events-none').click();
    // to do (can login)
  });

  /*it("sign out", () => {
    user.visit("/signup")
  });*/
});