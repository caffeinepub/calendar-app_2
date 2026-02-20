import Time "mo:core/Time";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";

actor {
  type Event = {
    id : Text;
    title : Text;
    description : Text;
    date : Text;
    time : Text;
    reminder : Bool;
    createdAt : Time.Time;
  };

  module Event {
    public func compare(a : Event, b : Event) : Order.Order {
      switch (Text.compare(a.date, b.date)) {
        case (#equal) { Text.compare(a.time, b.time) };
        case (order) { order };
      };
    };
  };

  let events = Map.empty<Text, Event>();

  public shared ({ caller }) func createEvent(id : Text, title : Text, description : Text, date : Text, time : Text, reminder : Bool) : async () {
    if (events.containsKey(id)) {
      Runtime.trap("Event with this ID already exists");
    };

    let newEvent : Event = {
      id;
      title;
      description;
      date;
      time;
      reminder;
      createdAt = Time.now();
    };

    events.add(id, newEvent);
  };

  public query ({ caller }) func getEvent(id : Text) : async Event {
    switch (events.get(id)) {
      case (null) { Runtime.trap("Event not found") };
      case (?event) { event };
    };
  };

  public shared ({ caller }) func updateEvent(id : Text, title : Text, description : Text, date : Text, time : Text, reminder : Bool) : async () {
    switch (events.get(id)) {
      case (null) { Runtime.trap("Event not found") };
      case (?existingEvent) {
        let updatedEvent : Event = {
          id;
          title;
          description;
          date;
          time;
          reminder;
          createdAt = existingEvent.createdAt;
        };
        events.add(id, updatedEvent);
      };
    };
  };

  public shared ({ caller }) func deleteEvent(id : Text) : async () {
    if (not events.containsKey(id)) {
      Runtime.trap("The event does not exist");
    };
    events.remove(id);
  };

  public query ({ caller }) func getAllEvents() : async [Event] {
    events.values().toArray().sort();
  };
};
