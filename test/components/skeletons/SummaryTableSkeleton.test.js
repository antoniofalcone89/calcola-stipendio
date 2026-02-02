import { render, screen } from '@testing-library/react';
import SummaryTableSkeleton from '../../../src/components/skeletons/SummaryTableSkeleton';

describe('SummaryTableSkeleton', () => {
  it('should render skeleton elements correctly', () => {
    render(<SummaryTableSkeleton />);
    
    // Check for skeleton elements
    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(5); // Title + header + rows + button
    
    // Check for title skeleton
    const titleSkeletons = document.querySelectorAll('.MuiSkeleton-text');
    expect(titleSkeletons.length).toBeGreaterThan(0);
    
    // Check for delete button skeleton
    const buttonSkeletons = document.querySelectorAll('.MuiSkeleton-rectangular');
    expect(buttonSkeletons.length).toBeGreaterThan(0);
  });

  it('should render 5 table row skeletons', () => {
    render(<SummaryTableSkeleton />);
    
    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    
    // Should have multiple skeleton elements for 5 rows
    expect(skeletons.length).toBeGreaterThan(20); // At least 5 rows × 4 columns + other elements
  });
});
