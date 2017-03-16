# BindingListView
Experimental React Native ListView implementation supporting direct view binding without going through the React Native bridge.

See the following blog post for more details:

https://medium.com/@talkol/react-native-listview-performance-revisited-recycling-without-the-bridge-c4f62d18c7dd#.8ll2r69xk

### What's in the repo

This repo implements a use-case of a Contact List having 5000 rows with React Native. 

The scroll performance and memory consumption should be comparable to what we're used to in pure-native becuase the React Native bridge doesn't play a part beyond initialization. Try it out! (on a real devide). Let me know how well it performs.
