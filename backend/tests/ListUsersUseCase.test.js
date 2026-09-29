const ListUsersUseCase = require("../src/application/ListUsersUseCase");

describe("ListUsersUseCase", () => {
  it("returns only name, username, and active status", () => {
    const userRepository = {
      findAll: () => [
        {
          id: "1",
          name: "Bodega Central",
          username: "bodega",
          active: false,
          role: "observer",
          passwordHash: "must-not-be-returned"
        }
      ]
    };
    const useCase = new ListUsersUseCase(userRepository);

    expect(useCase.execute()).toEqual([
      { name: "Bodega Central", username: "bodega", role: "observer", active: false }
    ]);
  });
});