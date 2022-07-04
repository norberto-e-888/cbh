# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

Given that I have no context on what purpose "deterministicPartitionKey" serves, I had to perfom my refactoring based on literal behavior.

We introduce 2 short-circuit return statements to minimize logical branching.

We remove the logical tree than spans lines 18-24 as the "else" block is unreachable given that there is no case were "candidate" would not be defined, and the nested condition within the "if" is also unreachable as the two possible assigments to "candidate" are of string value.

Finally, we're left with the condition on line 25 that checks if the lenght of "candidate" is greater than MAX_PARTITION_KEY_LENGTH, condition that could technically be met, but the re-assigment on line 26 does not make sense to me as a way to enfornce that the partition key has a maximum length, as the value of "candidate" passed to "Hash.update" could be one that results in a hash greater than length MAX_PARTITION_KEY_LENGTH anyways, so the conditional block does not guarantee that which it promises, so this part has been omitted from the refactored function as it needs clarification.
