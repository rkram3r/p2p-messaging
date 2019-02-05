export default interface Listener<T> {
  (event: T): any;
}
