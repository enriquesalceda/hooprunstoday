import { render, screen } from "@testing-library/react-native";

import { HomeScreen } from "@/components/home-screen";

describe("HomeScreen", () => {
  it("shows the app name", async () => {
    await render(<HomeScreen />);

    expect(screen.getByText("hoopruns.today")).toBeOnTheScreen();
  });
});
