<?php

/* Note: need to look at sanitizing uploaded files
   as this current method could be vulnerable to
   PATH TRAVERSAL allowing an attacker to access
   files that are outside of the intended file
   destination
*/

/* Get the name of the uploaded file */
$filename = $_FILES['file']['name'];

/* Choose where to save the uploaded file */
$location = "upload/".$filename;

/* Save the uploaded file to the local filesystem */
if ( move_uploaded_file($_FILES['file']['tmp_name'], $location) ) { 
  echo 'Success'; 
} else { 
  echo 'Failure'; 
}

?>

