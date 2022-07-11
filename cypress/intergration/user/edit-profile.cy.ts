describe("Edit Profile", () => {
    const user = cy;

    beforeEach(() => {
        // @ts-ignore
        user.login("e2e@mail.com", "e2e0000");
    });

    it("can go /edit-profile using the header", () => {
        user.get('a[href="/edit-profile"]').click();
        user.title().should("eq", "Edit Account | Nuber Eats");
    });

    it("can change email", () => {
        user.intercept("http://localhost:4000/graphql", (req) => {
            const { operationName } = req.body;
            if (operationName && operationName === "editProfile") {
                // @ts-ignore
                req.body?.variables?.input?.email = "e2e@mail.com";
            }
        })
        user.visit("/edit-profile");
        user.findByPlaceholderText(/email/i).clear().type("newe2e@mail.com");
        user.findByRole("button").click();
    })
})