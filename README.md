# Facebook Reaction Counter

`Note: This script SHOULD NOT be used on a public/production environment as it exposes your Facebook API secret. Working around this should be on the TODO list!`

#### What does this thing do?

A jQuery plugin for retrieving reaction totals from a Facebook post using the Facebook API.  

Initially developed to do live polls streaming to Facebook Live, but the script itself could probably be used for other things.

If you're new to HTML/CSS/JavaScript, see the examples folder for some basic examples using the script (Note: You'll need your App ID and App Secret from http://developers.facebook.com.

#### License
Released under the MIT license - http://opensource.org/licenses/MIT

## Requirements
* jQuery v1.x +
* Web server (makes asynchronous calls)
* An app created at http://developers.facebook.com (including App ID, and App Secret) https://developers.facebook.com/docs/apps/register

## Installation

The files are available either by cloning/downloading this repo  

`git clone christohill/fb-reaction-counter`  

or via Bower  
  
`bower install christohill/fb-reaction-counter`

## Usage

#### Link required files
Require jQuery (if not already included) and include the Reaction Counter script  

*Change these paths to fit your project*
```javascript
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="../jquery.fb-reaction-counter.js"></script>
```

#### Basic HTML Markup
Use the `data-reaction` attribute to choose which reactions you'd like to display. A child element will be added for the counter `fbr-counter` and the current count will be inserted there.  
  
Available reactions are: `love, like, haha, wow, angry, sad`  
```html
<main class="reaction-container">
  <section data-reaction="love"></section>
  <section data-reaction="like"></section>
  <section data-reaction="haha"></section>
  <section data-reaction="wow"></section>
  <section data-reaction="angry"></section>
  <section data-reaction="sad"></section>
</main>
```
##### Example output
```html
<section data-reaction="love">
  <span class="fbr-counter">1987</span>
</section>
```

### Initialize plugin

```javascript
<script>
  $(document).ready(function() { // When the document is ready

  	// Initialize the script on the .reaction-container element
    $('.reaction-container').reactionCounter({

      clientID: "203948720389472",
      clientSecret: "s98d7f6s987df687787df87f68",
      pageURL: 'https://facebook.com/marketing',
      postID: "10155446865956337",
      refreshTime: 5,
      appendPrepend: 'prepend',
      totalType: 'selected',
      totalSelector: '.fbr-total'

    });

  });
</script>
```

#### Plugin options
|Option | Description | Options | Default |
|-------|------------|---------|---------|
|clientID | The client ID supplied from the app you created on developers.facebook.com | *N/A* | NULL (required)
|clientSecret | The client secret supplied from the app you created on developers.facebook.com | *N/A* | NULL (required)
|pageURL | Page URL of your Facebook page (Note: This can't be used for standard user pages) | *N/A* | NULL (required)
|postID | The ID of the post you would like to get the in reaction counts from | *N/A* | NULL (required)
|refreshTime | How often to poll Facebook and update the data (measured in seconds) | `integer` | 5
|appendPrepend | Choose to add the counter before or after the content in the element | `append` or `prepend` | append
|defaultCount | Set a starting number for the counters | `integer` | 0
|totalType | Choose how to calculate the total amount of votes. Either from the reactions you've selected, or all 6 reactions | `all` or `selected` | selected
|totalSelector | An HTML element to display the total amount of reactions based on `totalType` | `element` | `.fbr-total`
