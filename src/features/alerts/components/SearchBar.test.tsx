import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
  it("renders with the correct initial value and placeholder", () => {
    render(
      <SearchBar value="test" onChange={() => {}} placeholder="Custom..." />
    );

    const input = screen.getByPlaceholderText("Custom...") as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe("test");
  });

  it("calls onChange when typing", () => {
    const handleChange = vi.fn();
    render(<SearchBar value="" onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "new search" } });

    expect(handleChange).toHaveBeenCalledWith("new search");
  });

  it("shows the clear button only when value is not empty", () => {
    const { rerender } = render(<SearchBar value="" onChange={() => {}} />);

    expect(screen.queryByLabelText("Clear search")).toBeNull();

    rerender(<SearchBar value="something" onChange={() => {}} />);

    expect(screen.getByLabelText("Clear search")).toBeTruthy();
  });

  it("calls onChange with an empty string when clear button is clicked", () => {
    const handleChange = vi.fn();
    render(<SearchBar value="to clear" onChange={handleChange} />);

    const clearButton = screen.getByLabelText("Clear search");
    fireEvent.click(clearButton);

    expect(handleChange).toHaveBeenCalledWith("");
  });
});
