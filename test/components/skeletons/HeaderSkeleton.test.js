import { render, screen } from '@testing-library/react';
import HeaderSkeleton from '../../../src/components/skeletons/HeaderSkeleton';

describe('HeaderSkeleton', () => {
  it('should render skeleton elements correctly', () => {
    render(<HeaderSkeleton />);
    
    // Check for skeleton elements
    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBe(2); // Title + user menu
    
    // Check for title skeleton
    const titleSkeletons = document.querySelectorAll('.MuiSkeleton-text');
    expect(titleSkeletons.length).toBe(1);
    
    // Check for user menu skeleton (circular)
    const menuSkeletons = document.querySelectorAll('.MuiSkeleton-circular');
    expect(menuSkeletons.length).toBe(1);
  });

  it('should have correct layout structure', () => {
    const { container } = render(<HeaderSkeleton />);
    
    // Check for flex container
    const flexContainer = container.firstChild;
    expect(flexContainer).toHaveStyle({
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    });
  });

  it('should have correct title skeleton width', () => {
    render(<HeaderSkeleton />);
    
    const titleSkeletons = document.querySelectorAll('.MuiSkeleton-text');
    expect(titleSkeletons[0]).toHaveStyle({ width: '60%' });
  });
});
