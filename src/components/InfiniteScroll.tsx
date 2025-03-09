// src/components/InfiniteScroll.tsx
import React, { useRef, useEffect, ReactNode } from 'react';
import styled from 'styled-components';

interface InfiniteScrollProps {
  children: ReactNode;
  loadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
}

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;
  font-size: 0.875rem;
  color: #586069;
`;

const ScrollContainer = styled.div`
  overflow-y: visible;
  width: 100%;
`;

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  loadMore,
  hasMore,
  isLoading,
  threshold = 200
}) => {
  // Ref for the sentinel element (the element we observe to trigger loading more)
  const sentinelRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Skip if loading or no more data
    if (isLoading || !hasMore) return;
    
    // Use Intersection Observer to detect when the sentinel is visible
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      {
        // Adjust rootMargin to load earlier or later
        rootMargin: `0px 0px ${threshold}px 0px`,
      }
    );
    
    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }
    
    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [loadMore, hasMore, isLoading, threshold]);
  
  return (
    <ScrollContainer>
      {children}
      
      {/* Sentinel element - when this becomes visible, we load more */}
      <div ref={sentinelRef} style={{ height: '10px', width: '100%' }} />
      
      {/* Loading indicator */}
      {isLoading && (
        <LoadingIndicator>
          <div>Loading more repositories...</div>
        </LoadingIndicator>
      )}
      
      {/* End message */}
      {!hasMore && !isLoading && (
        <LoadingIndicator>
          <div>No more repositories to load</div>
        </LoadingIndicator>
      )}
    </ScrollContainer>
  );
};

export default InfiniteScroll;