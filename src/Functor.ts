export abstract class Functor<T> {
  map: <B>(f: (a: T) => B) => Functor<B>;
  /**
   * Les 2 propositions suivantes doivent être vraies :
   *      Identité invariante : pour tout fx, fx.map(x => x) = fx
   *      composition : pour tout fx, fx.map(x => g(f(x))) = fx.map(f).map(g)
   */
}

export abstract class Monad<T> {
  map: <B>(f: (a: T) => B) => Monad<B>;

  static of: <T>(a: T) => Monad<T>; // constructor static
  flatMap: <B>(f: (item: T) => Monad<B>) => Monad<B>;
  /**
   * Les 3 propositions suivantes doivent être vraies :
   *      identité à gauche : pour tout mx: Monad<T>, mx.flatMap(x => Monad.of(x)) = mx
   *      identité à droite : pour tout x, Monad.of(x).flatMap(x => f(x)) = f(x)
   *      associativité : pout tout mx, f, g , mx.flatMap(f).flatMap(g) = mx.flatMap(x => f(x).flatMap(g) )
   */

  /**
   * Les fonctions suivantes découlent des autres fonctions
   */
  static flatten<T>(level2: Monad<Monad<T>>): Monad<T> {
    return level2.flatMap((x) => x);
  }
  static all<T>(monads: Monad<T>[]): Monad<T[]> {
    const firstMonad = monads.at(0);
    if (!firstMonad) {
      return Monad.of<T[]>([]);
    }
    return monads.slice(1).reduce(
      (acc, monad) =>
        acc.flatMap((items) => monad.map<T[]>((item) => [...items, item])),
      firstMonad.map((x) => [x])
    );
  }
}

/**
 * Avantages :
 *      fonctions pures => moins d'erreur
 *      composabilité
 * Inconvénients :
 *      performances à peu près équivalentes, légèrement plus lent
 *      beaucoup d'utilisation de la mémoire
 *      propagation virale de la structure de donnée dans la base de code
 *
 * Implémentation TS : https://github.com/gcanti/fp-ts
 *
 * Exemples d'objets JS étant des monades :
 * Array
 * Promise
 *
 * Monades connues :
 * Option<X> = [] (appelé None) ou [x] (appelé Some(x))
 * Either<A, B> = [a, null] ou [null, b] (monade à 2 compartiments)
 */
