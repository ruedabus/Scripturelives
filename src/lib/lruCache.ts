/**
 * src/lib/lruCache.ts
 *
 * Minimal LRU cache backed by a Map (which preserves insertion order).
 * When the cache exceeds `capacity`, the least-recently-used entry is evicted.
 *
 * Usage:
 *   const cache = new LRUCache<string, string | null>(300);
 *   cache.set("key", "value");
 *   cache.get("key"); // → "value"
 */
export class LRUCache<K, V> {
  private readonly capacity: number;
  private readonly map: Map<K, V>;

  constructor(capacity: number) {
    this.capacity = Math.max(1, capacity);
    this.map = new Map();
  }

  get(key: K): V | undefined {
    if (!this.map.has(key)) return undefined;
    // Refresh — move to "most recently used" position
    const value = this.map.get(key) as V;
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  has(key: K): boolean {
    return this.map.has(key);
  }

  /** Returns true if a new entry was inserted (vs. updated). */
  set(key: K, value: V): boolean {
    if (this.map.has(key)) {
      this.map.delete(key);
      this.map.set(key, value);
      return false;
    }
    if (this.map.size >= this.capacity) {
      // Evict the oldest entry (first in Map iteration order)
      const oldestKey = this.map.keys().next().value as K;
      this.map.delete(oldestKey);
    }
    this.map.set(key, value);
    return true;
  }

  get size(): number {
    return this.map.size;
  }
}
