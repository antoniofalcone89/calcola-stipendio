import { render, screen } from '@testing-library/react';
import HourlyRateInputSkeleton from '../../../src/components/skeletons/HourlyRateInputSkeleton';

describe('HourlyRateInputSkeleton', () => {
  it('should render skeleton elements correctly', () => {
    render(<HourlyRateInputSkeleton />);
    
    // Check for skeleton elements by their class names
    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBe(2); // 1 label + 1 input
    
    // Check that we have text and rectangular skeletons
    const textSkeletons = document.querySelectorAll('.MuiSkeleton-text');
    const rectangularSkeletons = document.querySelectorAll('.MuiSkeleton-rectangular');
    
    expect(textSkeletons.length).toBe(1);
    expect(rectangularSkeletons.length).toBe(1);
  });

  it('should have correct grid item props', () => {
    const { container } = render(<HourlyRateInputSkeleton />);
    const gridItem = container.firstChild;
    
    expect(gridItem).toHaveClass('MuiGrid-item');
  });
});
