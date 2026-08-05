# Wheel of Misfortune

**Wheel of Misfortune** is a game that aims to build confidence in on-call engineers via simulated outage scenarios.
With the game, you practice problem debugging under stress, understanding the incident management protocol,
and effective communication with other engineers of your team and organization.

This fork is set up for the **MLH Fellowship's Meta Production Engineering track**. The incidents, terminology,
and visual theme are adapted for that cohort, but the game itself works the same way it always has, and the
mechanics below still apply if you want to run it for any other group.

The game is inspired by the [Site Reliability Engineering](https://landing.google.com/sre/book/chapters/accelerating-sre-on-call.html#xref_training_disaster-rpg) book.

## Running it

This is a static site, no build step. From the project root:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Instructions

### Terminology

*   **Scenario**: A past or fictional incident case.
*   **Game Master**: The host-coordinator of the session.
*   **Volunteer**: The Fellow acting as trainee on-call engineer.

Each scenario is worked through four stages, in order:

*   **Acknowledge**: what is broken and who does it affect.
*   **Triage**: how bad it is. Impact and severity, not cause.
*   **Mitigate**: what stops the harm right now, even without knowing the cause.
*   **Resolve**: the real fix, so it does not come back on its own.

The Game Master decides when a team has earned the next stage. See
[game-master-sheet.md](game-master-sheet.md) for the answer key, hints, and probing questions used to run
sessions for this cohort &mdash; it is intentionally not linked from the site itself, since it is meant for
facilitators, not Fellows.

### Incident scenarios

Insert your incident scenarios into [incidents/general_incidents.json](incidents/general_incidents.json). Copy
[general\_incidents.json.sample](incidents/general\_incidents.json.sample) as a starting point if you're setting
this up from scratch. The file has the following format:

- **id**: the unique ID of the outage (you can just auto-increment).
- **title**: the title of the incident, shown on the wheel &mdash; keep it short so it fits on a slice.
- **scenario**: the description of the incident, as HTML. It is useful to include URLs from monitoring
  systems, dashboards, time-series databases and playbooks.
- **inkstory**: the path to an [Ink](https://www.inklestudios.com/ink/) story file in JSON format.

You can also use [general\_incidents.jsonnet](incidents/general_incidents.jsonnet.sample) as an example, in case you want to generate your incident scenarios using [Jsonnet](https://jsonnet.org/).

### Team builder

The left-hand panel lets the Game Master check off which Fellows are available and generate four teams, one
per stage (Acknowledge / Triage / Mitigate / Resolve). Names are pulled from [fellows.json](fellows.json) &mdash;
edit that file to update the roster. Teams are split as evenly as possible; Acknowledge is the team most
likely to run a member short when the count doesn't divide evenly by four. Team generation is independent of
the wheel: spinning does not reset or regenerate teams, and generating teams does not spin the wheel.

### Ink
[Ink](https://github.com/inkle/ink) is a scripting language for writing interactive narrative stories. It enables us to write interactive incident response narratives for team or individual trainings. You can use [Inky](https://github.com/inkle/inky) to write an interactive narrative for an incident and then export the story as JSON. Then, you can store the story file inside the [incidents/](incidents/) folder and associate the Ink story file with an Incident scenario using the **inkstory** key. You can read an example incident narrative [here](https://github.com/dastergon/wheel-of-misfortune/tree/master/incidents/redis-story.json).

### Role Playing
#### Game Master

1.  Choose a volunteer (Fellow) to be the primary on-call engineer in front of the group.
2.  Find a balance between the volunteer's experience and the incident's difficulty.
3.  Assist the volunteer by answering questions that may arise in each theoretical action or dashboard observation.
    * Engage with the rest of the team and ask for different ways to debug the problem following the volunteer's explanation.
    * Team members may be made available over time for assistance in various topics.
    * Approve or send back each of the four stages as the group works through them &mdash; see [game-master-sheet.md](game-master-sheet.md).
4.  At the end, have a debrief on the learnings of the session.

#### Volunteer

1.  Spin the wheel and attempt to fix the theoretical outage scenario.
2.  Explain to the Game Master and the rest of the group what actions you would take (lookup queries, checks in dashboards, etc.) to find the root causes, and eventually solve the incident.
3.  Always keep an eye on the time, since it is a simulated incident response scenario and not a routine troubleshooting process. During a real incident, you might have an SLA or SLO breach and therefore you should take timing into account.
4.  Engage with the rest of the group. Keep them in the loop. Ask questions to different members depending on their expertise.

Most importantly, **have fun!**

You can [read](https://landing.google.com/sre/book/chapters/accelerating-sre-on-call.html#xref_training_disaster-rpg) a comprehensive example on how to conduct the exercise in the Google SRE book.

### Featured

The Wheel of Misfortune was established as a practice in [Open Practice Library](https://openpracticelibrary.com/) and this project was [featured](https://openpracticelibrary.com/practice/wheel-of-misfortune/) there.

### Resources

*   [Disaster Role Playing](https://landing.google.com/sre/book/chapters/accelerating-sre-on-call.html#xref_training_disaster-rpg)
*   [Managing Misfortune for Best Results](https://www.usenix.org/conference/srecon18europe/presentation/barry)
*   [Postmortem Culture: Learning from Failure](https://landing.google.com/sre/book/chapters/postmortem-culture.html)
*   [Postmortem Templates](https://github.com/dastergon/postmortem-templates)
*   [Postmortems Metadata Index](https://postmortems.app)
*   [Site Reliability Engineering Resources](https://github.com/dastergon/awesome-sre)

### Credit

This is a fork of [dastergon/wheel-of-misfortune](https://github.com/dastergon/wheel-of-misfortune) by
Pavlos Ratis, re-themed and extended for the MLH Fellowship. See [LICENSE](LICENSE) for the original MIT
license.
