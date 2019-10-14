---
title: Typescript Generics
date: 2019-10-13T23:00:00.000Z
description: Generics in Typescript
---

A major part of software engineering is building components that not only have well-defined and consistent APIs, but are also reusable. Generics in Typescript allow the creation of components that will work with multiple types.

The most basic example using generics is an array. With Typescript, you are able to define the types that will fill the array:

```Typescript
const strArr: string[] = ["one", "two", "three"];

strArr.push(1) // This would error
```

If we were to use `string[]` to define an arg type in a function, as expected, we would get errors if the arg was not an array or strings. However, there are scenarios where a function may be required that will be able to handle arrays of different types. Consider the following example - `getLast` returns the last item in an array

```Typescript
const getLast = (arr: string[]): string => {
   return arr[arr.index - 1];
}

// 'test2'
console.log(getLast(['test', 'test2']);

// Will error
console.log(getLast([1,2,3]);
```

Here you can see, we are restricting to the array we can pass into `getLast` to only contain strings. However, it would be perfectly reasonable to want to return the last item in an array containing any types. Here, we can use a _type_ variable, a special variable that works on types rather than values:

```Typescript
const getLast<T> = (arr T[]): T => {
        return arr[arr.index - 1];
}
```

As you can see above, we are able to define the type of array being passed into `getLast` as the type variable `T` (_note - `T` is conventional name for a type variable, however any name is usable_), and Typescript will also be aware of the return type. This turns the above into a generic function. To call the function with different types, the syntax is the following:

```Typescript
const numOutput = getLast<number[]>([1,2,3]) // output will be of type 'number'(3)

const strOutput = getLast<string[]>(['a','b','c']) // output will be of type 'string'('c')
```

It is possible to use more than one type variable when creating a generic function:

```Typescript
cont makeArr<X, Y> = (x: X, y: Y): [X, Y] => {
    return [x, y];
}

const v = makeArr<number, string>([1,'a']); // returns type ['number', 'string']

// Types can be inferred by Typescript, <number, number> is not necessary.
const v2 = makeArr(2,3) // returns type ['number', 'number']
```

It is possible to extend type variable from other object types. If we wanted to make a function that only works on types that have a `.length` property,.To do so, we must list our requirement as a constraint on what `T` can be.

To do so, we’ll create an interface that describes our constraint. Here, we’ll create an interface that has a single `.length` property and then we’ll use this interface and the `extends` keyword to denote our constraint:

```Typescript
interface WithLength {
    length: number
}

function echo<T extends WithLength>(arg: T): T {
    console.log(arg.length);  // arg has a .length property, so no error
    return arg;
}
```

## Generics with Interfaces

It is possible to use generics to create more flexible interfaces in our code. The syntax is similar to the above examples. This is useful when we can only be sure of part of the shape of an object, such as a http request:

```Typescript
interface HttpResponse<T> {
    success: boolean
    error?: string
    data: T
}

type StringResponse = HttpResponse<string>
```

The above could then be used in a function to allow more control over the returned data in our code base.

```Typescript
interface Person {
    name: string
    age: number
}

const makeRequest<T> = async() => {
    const response = await // some logic
    return response;
}

const data = makeRequest<HttpResponse<Person>>() // resolves with data as a Person
```

## Useful articles

**[Official Typescript docs](https://www.typescriptlang.org/docs/handbook/generics.html)**

[**YouTube Tutorial on Typescript generics**](https://www.youtube.com/watch?v=nViEqpgwxHE)
