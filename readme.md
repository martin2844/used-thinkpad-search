# Meli Thinkpad search


React and Node full stack thinkpad searcher.











# Version History

0.1 - Basic Scaffolding
    Must improve state scaffold. Should use reducer instead of so many use State. This would help re-rendering-
    Must create comparing algorithm via Node, then, create cron job to email differences in algorithm.

0.2 - New UI branch - New UI - Will have user login and saving for each user with settings for emailing.
    - Updated UI with MaterialUI 
    - Added mongoDB implementation to be able to deploy to heroku, since heroku is ephimeral, saving to FS wont persist the data of saved queries. 
    - Refactored FS saving function, to a MongoDB saving Function.
    Should replace findoneandupdate since its deprecated.
    