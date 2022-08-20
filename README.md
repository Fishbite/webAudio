# Da Synth Dude

**Da Synth Dude** has been built using the Web Audio API and is unique in as much as
it allows the user to record the music they are creating directly from the running
oscillators, rather than though a microphone.

The project is in its infancy, but we do have a machine that allows you to do the
following:

- Play musical notes from a range of eight octaves:- 0 through 7 as on a full size
  keyboard
- Change the octave, waveform and decay of the notes to create different voices
- Play a range of drums: Kick, Kettle, Snare, Hi-hat
- Play pre-recorded music to play along side with
- Record as you play including the ability to record on top of pre-reorcded music that
  that you are playing along to.
- Download the recording directly from the Audio Player for editing etc.
- Upload the recording as music.wav so that it can be played back and added to

This could be the start of something great!

## The State of Play

The user can now record music as they are playing, then down load it directly from the media player. The file then needs to be imported into editing software such as Audacity and then saved out as 'music.wav'

music.wav can be uploaded to the server and then played back via the 'pre-recorded music' playback keys. The user can then record additional stuff on top of the music being played back.

There's an awful lot more that we can do to build on this app, such as create more
voices / instruments and indeed; give the user the abiliity to use musical compositions
they have created directly from the GUI. How we do this has yet to be decided, perhaps
we could use local storage, instead of uploading to the server. If we give the ability
to upload to the server, then we must also provide a method of selecting the file to be
played via the GUI, At present, the app only looks for one file **music.wav** and it is
the only file that can be played, however, it can be overwritten as stated above.

## Collaborators

We'd love to have anyone interested in music contribute to this project. If you'd like
to get involved just DM me, fork the repo', do some cool stuff, do a pull request :¬)

## Open Source

This project is open source licensed under the
GNU AFFERO GENERAL PUBLIC LICENSE Version 3 or later
