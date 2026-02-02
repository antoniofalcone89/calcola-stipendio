import { render, screen } from '@testing-library/react';
import TotalSummarySkeleton from '../../../src/components/skeletons/TotalSummarySkeleton';

describe('TotalSummarySkeleton', () => {
  it('should render skeleton elements correctly', () => {
    render(<TotalSummarySkeleton />);
    
    // Check for skeleton elements
    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(2); // Title + 2 cards
    
    // Check for title skeleton
    const titleSkeletons = document.querySelectorAll('.MuiSkeleton-text');
    expect(titleSkeletons.length).toBeGreaterThan(0);
    
    // Check for summary card skeletons
    const cardSkeletons = document.querySelectorAll('.MuiSkeleton-rectangular');
    expect(cardSkeletons.length).toBe(2); // 2 summary cards
  });

  it('should render grid layout correctly', () => {
    const { container } = render(<TotalSummarySkeleton />);
    
    // Check for Grid container
    const gridContainer = container.querySelector('.MuiGrid-container');
    expect(gridContainer).toBeInTheDocument();
    
    // Check for Grid items
    const gridItems = container.querySelectorAll('.MuiGrid-item');
    expect(gridItems).toHaveLength(2); // 2 grid items for the 2 cards
  });
});
