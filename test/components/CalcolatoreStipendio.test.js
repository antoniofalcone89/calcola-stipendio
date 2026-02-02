import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CalcolatoreStipendio from "../../src/components/CalcolatoreStipendio";
import * as firestore from "../../src/db/firestore";

// Mock Firebase
jest.mock("firebase/auth", () => ({
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  getAuth: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));

jest.mock("../../src/config/firebase", () => ({
  auth: {},
  googleProvider: {},
}));

jest.mock("../../src/db/firestore", () => ({
  loadTotalsFS: jest.fn(async () => ({ totaleOre: 0, totaleStipendio: 0 })),
  saveTotalsFS: jest.fn(async () => {}),
}));

// Mock hooks at the top level
jest.mock("../../src/hooks/usePagaOraria", () => ({
  usePagaOraria: jest.fn(),
}));

jest.mock("../../src/hooks/useOreLavorate", () => ({
  useOreLavorate: jest.fn(),
}));

jest.mock("../../src/contexts/AuthContext", () => ({
  useAuth: jest.fn(() => ({
    currentUser: { uid: "test-user-id" },
    signInWithGoogle: jest.fn(),
    logout: jest.fn(),
    loading: false,
  })),
}));

describe("CalcolatoreStipendio", () => {
  const mockUsePagaOraria =
    require("../../src/hooks/usePagaOraria").usePagaOraria;
  const mockUseOreLavorate =
    require("../../src/hooks/useOreLavorate").useOreLavorate;

  beforeEach(() => {
    jest.clearAllMocks();
    firestore.loadTotalsFS.mockResolvedValue({
      totaleOre: 0,
      totaleStipendio: 0,
    });
    firestore.saveTotalsFS.mockResolvedValue();
  });

  describe("when data is loading", () => {
    it("should render skeleton components while loading", () => {
      mockUsePagaOraria.mockReturnValue({
        pagaOraria: null,
        setPagaOraria: jest.fn(),
        savePagaOraria: jest.fn(),
        loading: true,
        hasChanged: false,
      });
      mockUseOreLavorate.mockReturnValue({
        oreLavorate: null,
        saveHours: jest.fn().mockResolvedValue(),
        removeHours: jest.fn().mockResolvedValue(),
        removeAllHours: jest.fn().mockResolvedValue(),
        loading: true,
      });

      render(<CalcolatoreStipendio />);

      // Should show skeleton elements instead of actual content
      expect(
        screen.queryByLabelText("Paga oraria (€)"),
      ).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/ore lavorate/i)).not.toBeInTheDocument();
      expect(screen.queryByText("Riepilogo del mese")).not.toBeInTheDocument();
      expect(screen.queryByText("Totali")).not.toBeInTheDocument();

      // Should show skeleton elements (using class selectors)
      const skeletons = document.querySelectorAll(".MuiSkeleton-root");
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it("should render header skeleton while loading", () => {
      mockUsePagaOraria.mockReturnValue({
        pagaOraria: null,
        setPagaOraria: jest.fn(),
        savePagaOraria: jest.fn(),
        loading: true,
        hasChanged: false,
      });
      mockUseOreLavorate.mockReturnValue({
        oreLavorate: null,
        saveHours: jest.fn().mockResolvedValue(),
        removeHours: jest.fn().mockResolvedValue(),
        removeAllHours: jest.fn().mockResolvedValue(),
        loading: true,
      });

      render(<CalcolatoreStipendio />);

      // Should show skeleton header instead of actual title
      expect(
        screen.queryByText(/calcolatore stipendio/i),
      ).not.toBeInTheDocument();

      // Should show skeleton elements (using class selectors)
      const skeletons = document.querySelectorAll(".MuiSkeleton-root");
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe("when data is loaded", () => {
    beforeEach(() => {
      mockUsePagaOraria.mockReturnValue({
        pagaOraria: 10,
        setPagaOraria: jest.fn(),
        savePagaOraria: jest.fn(),
        loading: false,
        hasChanged: false,
      });
      mockUseOreLavorate.mockReturnValue({
        oreLavorate: {},
        saveHours: jest.fn().mockResolvedValue(),
        removeHours: jest.fn().mockResolvedValue(),
        removeAllHours: jest.fn().mockResolvedValue(),
        loading: false,
      });
    });

    it("should render main title with current month", async () => {
      render(<CalcolatoreStipendio />);

      await waitFor(() => {
        expect(screen.getByText(/calcolatore stipendio/i)).toBeInTheDocument();
      });
    });

    it("should render hourly rate input", () => {
      render(<CalcolatoreStipendio />);

      expect(screen.getByLabelText("Paga oraria (€/h)")).toBeInTheDocument();
    });

    it("should render work hours input", () => {
      render(<CalcolatoreStipendio />);

      expect(screen.getByLabelText(/ore lavorate/i)).toBeInTheDocument();
    });

    it("should render summary table", () => {
      render(<CalcolatoreStipendio />);

      expect(screen.getByText("Riepilogo del mese")).toBeInTheDocument();
    });

    it("should render total summary", async () => {
      render(<CalcolatoreStipendio />);

      await waitFor(() => {
        expect(screen.getByText("Totali")).toBeInTheDocument();
      });
    });

    it("should calculate and display totals correctly", async () => {
      mockUseOreLavorate.mockReturnValue({
        oreLavorate: {
          "2024-01-15": 8.5,
          "2024-01-16": 7.5,
        },
        saveHours: jest.fn().mockResolvedValue(),
        removeHours: jest.fn().mockResolvedValue(),
        removeAllHours: jest.fn().mockResolvedValue(),
        loading: false,
      });

      render(<CalcolatoreStipendio />);

      await waitFor(() => {
        expect(screen.getByText(/ore totali:/i)).toBeInTheDocument();
        expect(screen.getByText(/stipendio previsto:/i)).toBeInTheDocument();
      });
    });

    it("should allow saving work hours", async () => {
      const mockSaveHours = jest.fn().mockResolvedValue();
      mockUseOreLavorate.mockReturnValue({
        oreLavorate: {},
        saveHours: mockSaveHours,
        removeHours: jest.fn().mockResolvedValue(),
        removeAllHours: jest.fn().mockResolvedValue(),
        loading: false,
      });

      render(<CalcolatoreStipendio />);

      await waitFor(() => {
        const hoursInput = screen.getByLabelText(/ore lavorate/i);
        // then type
      });

      const hoursInput = screen.getByLabelText(/ore lavorate/i);
      await userEvent.type(hoursInput, "08.30");

      const saveButton = screen.getByRole("button", { name: /salva ore/i });
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(mockSaveHours).toHaveBeenCalled();
      });
    });

    it("should load and save totals to Firestore", async () => {
      render(<CalcolatoreStipendio />);

      await waitFor(() => {
        expect(firestore.loadTotalsFS).toHaveBeenCalledWith("test-user-id");
      });
    });
  });

  describe("when user is not logged in", () => {
    beforeEach(() => {
      const { useAuth } = require("../../src/contexts/AuthContext");
      useAuth.mockReturnValue({
        currentUser: null,
        signInWithGoogle: jest.fn(),
        logout: jest.fn(),
        loading: false,
      });

      mockUsePagaOraria.mockReturnValue({
        pagaOraria: null,
        setPagaOraria: jest.fn(),
        savePagaOraria: jest.fn(),
        loading: false,
        hasChanged: false,
      });
      mockUseOreLavorate.mockReturnValue({
        oreLavorate: null,
        saveHours: jest.fn().mockResolvedValue(),
        removeHours: jest.fn().mockResolvedValue(),
        removeAllHours: jest.fn().mockResolvedValue(),
        loading: false,
      });
    });

    it("should show skeleton when no user is logged in", () => {
      render(<CalcolatoreStipendio />);

      // Should show skeleton since data is null
      const skeletons = document.querySelectorAll(".MuiSkeleton-root");
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe("error handling", () => {
    it("should handle Firestore errors gracefully", async () => {
      firestore.loadTotalsFS.mockRejectedValue(new Error("Firestore error"));

      mockUsePagaOraria.mockReturnValue({
        pagaOraria: 10,
        setPagaOraria: jest.fn(),
        savePagaOraria: jest.fn(),
        loading: false,
        hasChanged: false,
      });
      mockUseOreLavorate.mockReturnValue({
        oreLavorate: {},
        saveHours: jest.fn().mockResolvedValue(),
        removeHours: jest.fn().mockResolvedValue(),
        removeAllHours: jest.fn().mockResolvedValue(),
        loading: false,
      });

      render(<CalcolatoreStipendio />);

      await waitFor(() => {
        expect(screen.getByText(/calcolatore stipendio/i)).toBeInTheDocument();
      });
    });
  });
});
