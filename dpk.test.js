const { deterministicPartitionKey } = require("./dpk");
const crypto = require("crypto");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Return the already existing _partitionKey when it is present", () => {
    const event = {
      _partitionKey: "123",
    };

    const partitionKey = deterministicPartitionKey(event);
    expect(partitionKey).toBe("123");
  });

  it("Is deterministic in its output", () => {
    const event1 = {
      a: 1,
    };

    const event2 = {
      a: 2,
    };

    const event3 = {
      a: 3,
    };

    const event1PartitionKey = deterministicPartitionKey(event1);
    const event2PartitionKey = deterministicPartitionKey(event2);

    expect(event1PartitionKey).not.toBe(event2PartitionKey);

    const outputs = new Array(1000).fill(0).map(() => {
      return deterministicPartitionKey(event3);
    });

    const setOfResults = new Set(outputs);

    expect(setOfResults.size).toBe(1);
  });
});
