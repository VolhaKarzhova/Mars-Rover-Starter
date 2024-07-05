const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function () {

  it("constructor sets position and default values for mode and generatorWatts", function () {
    const testRover = new Rover(1245);
    expect(testRover.position).toBe(1245);
    expect(testRover.mode).toBe('NORMAL');
    expect(testRover.generatorWatts).toBe(110);
  });

  it('response returned by receiveMessage contains the name of the message', function () {
    const testMessage = new Message("Test");
    expect(new Rover(1234).receiveMessage(testMessage).message).toEqual(testMessage.name);
  });

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function () {
    const testMessage = new Message("Test", [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')]);
    const response = new Rover(1234).receiveMessage(testMessage);
    expect(response).toHaveProperty('results');
    expect(response.results.length).toBe(2);
  });

  it("responds correctly to the status check command", function () {
    const testMessage = new Message("Test", [new Command('STATUS_CHECK')]);
    const rover = new Rover(1234);
    const response = rover.receiveMessage(testMessage);
    expect(response.results[0]).toHaveProperty("roverStatus");
    expect(response.results[0].roverStatus.mode).toEqual(rover.mode);
    expect(response.results[0].roverStatus.generatorWatts).toEqual(rover.generatorWatts);
    expect(response.results[0].roverStatus.position).toEqual(rover.position);

  });

  it("responds correctly to the mode change command", function () {
    const testMessage = new Message("Test", [new Command('MODE_CHANGE', 'LOW_POWER')]);
    const rover = new Rover(1234);
    const response = rover.receiveMessage(testMessage);
    expect(response.results[0].completed).toBeTruthy();
    expect(rover.mode).toBe('LOW_POWER');
  });

  it('responds with a false completed value when attempting to move in LOW_POWER mode', function () {
    const testMessage = new Message("Test", [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('MOVE', 1245)]);
    const rover = new Rover(555);
    const response = rover.receiveMessage(testMessage);
    expect(response.results[1].completed).toBeFalsy();
  });

  it("responds with the position for the move command", function () {
    const testMessage = new Message("Test", [new Command('MOVE', 1245)]);
    const rover = new Rover(555);
    const response = rover.receiveMessage(testMessage);
    expect(response.results[0].completed).toBeTruthy();
    expect(rover.position).toBe(1245);
  });

});
