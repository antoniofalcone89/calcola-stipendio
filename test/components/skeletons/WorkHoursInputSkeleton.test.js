import { render, screen } from '@testing-library/react';
import WorkHoursInputSkeleton from '../../../src/components/skeletons/WorkHoursInputSkeleton';

describe('WorkHoursInputSkeleton', () => {
  it('should render skeleton elements correctly', () => {
    render(<WorkHoursInputSkeleton />);
    
    // Check for all skeleton elements
    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBe(3); // 1 label + 2 inputs
    
    // Check for text skeleton (label)
    const textSkeletons = document.querySelectorAll('.MuiSkeleton-text');
    expect(textSkeletons.length).toBe(1);
    
    // Check for rectangular skeletons (inputs)
    const rectangularSkeletons = document.querySelectorAll('.MuiSkeleton-rectangular');
    expect(rectangularSkeletons.length).toBe(2);
  });

  it('should have correct grid item props', () => {
    const { container } = render(<WorkHoursInputSkeleton />);
    const gridItem = container.firstChild;
    
    expect(gridItem).toHaveClass('MuiGrid-item');
  });
});
