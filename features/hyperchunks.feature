Feature: Slycat Agent

  Scenario Outline: Parsing valid hyperchunk expressions.
    When parsing a hyperchunk expression, <expression> is valid.

    Examples:
      | expression                            |
      | 0                                     |
      | 0;1                                   |
      | 0/1                                   |
      | 0/1;2/3                               |
      | 0:5                                   |
      | 0:5:2                                 |
      | :5:2                                  |
      | 0::2                                  |
      | 0:5/10:15                             |
      | .../10:15                             |
      | 0:5/...                               |
      | 0/1/20                                |
      | 0/1/20:25                             |
      | 0/1/20,25                             |
      | 0/1/20:25,30:35                       |
      | 0/1/20!25                             |
      | 0/1/20:25!30:35                       |
      | 0!1                                   |
      | 0/1!2                                 |
      | 0/indices()                           |
      | 0/indices(0)                          |
      | 0/indices(0.5)                        |
      | 0/indices("red")                      |
      | 0/indices(0, 0.5, "red")              |
      | 0/indices(0)/0:50                     |
      | 0/a1 > 2                              |
      | 0/a1 > 2/0:50                         |
      | 0/a1 > 2 and a1 < 4/0:50              |
      | 0/a1 in [0, 5, 6]                     |
      | 0/a1 in ["red", "cayenne"]            |
      | 0/.../order: rank(a1, "asc")/0:50     |

  Scenario Outline: Parsing invalid hyperchunk expressions.
    When parsing a hyperchunk expression, <expression> is invalid.

    Examples:
      | expression                            |
      | foo                                   |
      | 0/foo                                 |
      | 0/1/foo                               |
