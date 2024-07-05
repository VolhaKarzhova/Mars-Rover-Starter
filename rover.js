class Rover {
   // Write code here!
   constructor(position) {
      this.position = position;
      this.mode = "NORMAL";
      this.generatorWatts = 110;
   }

   receiveMessage(message) {
      let commandResults = [];
      if (message.commands !== undefined) {
         for (let i = 0; i < message.commands.length; i++) {
            if (message.commands[i].commandType === "STATUS_CHECK") {
               commandResults.push(this.processCheckStatusCommand());
            };
            if (message.commands[i].commandType === 'MOVE') {
               commandResults.push(this.processMoveCommand(message.commands[i].value));
            };
            if (message.commands[i].commandType === 'MODE_CHANGE') {
               commandResults.push(this.processModeChangeCommand(message.commands[i].value));
            };
         }
      };
      let response = {
         message: message.name,
         results: commandResults
      }
      return response;
   }

   processCheckStatusCommand() {
      let status = {
         mode: this.mode,
         generatorWatts: this.generatorWatts,
         position: this.position
      };
      return { completed: true, roverStatus: status };
   };

   processModeChangeCommand(value) {
      this.mode = value;
      return { completed: true };
   };

   processMoveCommand(newPosition) {
      if (this.mode === "LOW_POWER") {
         return { completed: false };
      };
      if (this.mode === "NORMAL") {
         this.position = newPosition;
         return { completed: true };
      };
   }
}


module.exports = Rover;